<?php

/**
 * test actions.
 *
 * @package    opTestApiPlugin
 * @subpackage action
 * @author     Kimura Youichi <kim.upsilon@bucyou.net>
 * @license    Apache License 2.0
 */
class testActions extends opJsonApiActions
{
  public function executeSetup(sfWebRequest $request)
  {
    if (!isset($request['force']) || '1' !== $request['force'])
    {
      return $this->forward400('

WARNING: This API overwrites existing database.
Do you really want to execute?
To execute this API, append `?force=1` to URL');
    }

    $target = isset($request['target']) ? $request['target'] : null;
    if (empty($target) || !preg_match('/^[0-9A-Za-z]+$/', $target))
    {
      $target = 'opTestApiPlugin';
    }

    chdir(sfConfig::get('sf_root_dir'));
    $configuration = sfContext::getInstance()->getConfiguration();

    $task = new sfDoctrineDropDbTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run(array(), array('no-confirmation' => true));

    $task = new sfDoctrineBuildDbTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run();

    $conn = Doctrine_Core::getTable('SnsConfig')->getConnection();
    if ($conn instanceof Doctrine_Connection_Sqlite)
    {
      $info = $conn->getManager()->parseDsn($conn->getOption('dsn'));
      chmod(dirname($info['database']), 0777);
      chmod($info['database'], 0777);
    }

    $task = new sfDoctrineBuildSqlTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run();

    $task = new sfDoctrineInsertSqlTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run();

    $task = new sfDoctrineDataLoadTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run(array('dir_or_file' => dirname(__FILE__).'/../../../../../../'.$target.'/test/fixtures/'));

    return $this->renderJSON(array('status' => 'success'));
  }
}
